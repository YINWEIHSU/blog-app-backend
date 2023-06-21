const db = require('../models')
const { User, Post, Tag, PostTag, Category } = db
const { generateSlug } = require('../common/utils')

const postController = {
  getPosts: async (req, res) => {
    const posts = await Post.cache('all').findAll({
      attributes: ['id', 'title', 'content', 'status', 'createdAt', 'updatedAt', 'slug', 'category_id'],
      include: [
        {
          model: Tag,
          through: { attributes: [] }, // 這將排除 join table 的所有屬性
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    let results = posts.map(post => {
      // handle post from db
      if (post.dataValues) {
        post = post.dataValues
      }
      post = {
        ...post,
        tags: post.Tags.map(tag => {
          return { id: tag.id, name: tag.name }
        })
      }
      delete post.Tags

      return post
    })

    if (!req.user) {
      results = results.filter(post => post.status === 'published')
    }
    return res.status(200).json(results)
  },
  getPost: async (req, res) => {
    const slug = req.params.slug
    const post = await Post.cache(req.params.slug).findOne({
      where: { slug },
      include: [
        { model: User, attributes: ['email'] },
        { model: Category, attributes: ['name'] },
        { model: Tag, through: { attributes: [] }, attributes: ['id', 'name'] }
      ]
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Transform post data to match your previous structure and include tags as an array
    const result = {
      id: post.id,
      img: post.img,
      email: post.User.email,
      title: post.title,
      content: post.content,
      category: post.Category.name,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      tags: post.Tags,
      status: post.status,
      slug: post.slug
    }

    return res.status(200).json(result)
  },
  createPost: async (req, res) => {
    const { title, content, category, tags, status } = req.body

    const userId = req.user.id
    const categoryData = await Category.findOne({ where: { name: category } })
    const post = await Post.create({
      title,
      content,
      status,
      UserId: userId,
      CategoryId: categoryData.id
    })

    const slug = generateSlug(title, post.id)
    await post.update({ slug })

    const tagPromises = tags.map(async (tag) => {
      const [tagObject, created] = await Tag.findOrCreate({ where: { name: tag }, defaults: { count: 1 } })
      // new tag
      if (!created) {
        tagObject.count += 1
        await tagObject.save()
      }
      // exists tag
      await PostTag.create({ postId: post.id, tagId: tagObject.id })
      return tagObject
    })
    await Promise.all(tagPromises)
    await Tag.clearCache('all')
    await Post.clearCache('all')

    return res.status(201).json(post)
  },
  updatePost: async (req, res) => {
    const { id, title, content, category, tags, status } = req.body

    const categoryData = await Category.findOne({ where: { name: category } })
    const post = await Post.findByPk(id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    const slug = generateSlug(title, id)
    await Post.clearCache(slug)
    await Post.clearCache('all')
    await post.update({
      title,
      content,
      status,
      slug,
      CategoryId: categoryData.id
    })

    const postTags = await PostTag.findAll({ where: { postId: id } })
    const oldTagIds = postTags.map(postTag => postTag.tagId)

    const tagPromises = tags.map(async (tag) => {
      const [tagObject, created] = await Tag.findOrCreate({ where: { name: tag }, defaults: { count: 1 } })
      if (!oldTagIds.includes(tagObject.id)) {
        // new tag
        if (!created) {
          tagObject.count += 1
          await tagObject.save()
        }
        // exists tag
        await PostTag.create({ postId: id, tagId: tagObject.id })
      }
      return tagObject
    })
    const tagObjects = await Promise.all(tagPromises)
    const newTagIds = tagObjects.map(tagObject => tagObject.id)

    // Tags to be removed
    const tagIdsToRemove = oldTagIds.filter(oldTagId => !newTagIds.includes(oldTagId))
    const removePromises = tagIdsToRemove.map(async (tagId) => {
      // delete data in table
      await PostTag.destroy({ where: { postId: id, tagId } })

      // find tag
      const tag = await Tag.findByPk(tagId)

      tag.count -= 1

      if (tag.count <= 0) {
        await tag.destroy()
      } else {
        await tag.save()
      }
    })
    await Tag.clearCache('all')
    await Promise.all(removePromises)
    return res.status(200).json(post)
  },
  deletePost: async (req, res) => {
    const user = req.user
    const postData = await Post.findOne({ where: { slug: req.params.slug } })
    const post = postData
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    if (post.UserId !== user.id) {
      return res.status(403).json({ message: 'You are not authorized to do this' })
    }
    // Find all associated PostTags and Tags
    const postTags = await PostTag.findAll({ where: { postId: post.id } })
    const tags = await Tag.findAll({ where: { id: postTags.map(pt => pt.tagId) } })

    // Decrement count for each tag
    for (const tag of tags) {
      tag.count -= 1
      if (tag.count <= 0) {
        await tag.destroy()
      } else {
        await tag.save()
      }
    }
    await Tag.clearCache('all')
    // Remove PostTags
    await PostTag.destroy({ where: { postId: post.id } })

    // Finally remove the post
    await Post.clearCache(post.slug)
    await Post.clearCache('all')
    await postData.destroy()

    return res.status(204).json({ message: 'Post deleted' })
  }
}

module.exports = postController
