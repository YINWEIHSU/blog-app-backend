# 簡易個人部落格（伺服器端）
這是一個基於 Node.js, MySQL, 和 Redis 實作的部落格後端服務，主要以個人架設部落格的需求去設計。

## 環境
- Nodejs: 18.13.0以上
- MySQL: 8.0.33以上
- Redis:7.0.11以上

## 安裝與執行
1. 安裝套件
    ```
    npm install
    ```
2. 建立.env檔案並設定環境變數，可參考.env.example進行設置
    ```
    PORT: port號
    REDIS_URL: redis連線資訊
    SQL_URL: SQL連線資訊
    JWT_SECRET: jwt secret
    ROOT_EMAIL: 管理者的帳號
    FRONTEND_URL: 前端連線位址
    ```
3. 若有前端靜態檔案，可將其命名為frontend放在根目錄底下
  前端頁面可參考[這裡](https://github.com/YINWEIHSU/blog-app-frontend)。

4. 在終端機輸入下面指令即可成功執行。
    ```
    npm run dev
    ```

---

# Simple Personal Blog (Server Side)
This is a blog backend service implemented with Node.js, MySQL, and Redis. It is designed primarily to cater to the needs of setting up a personal blog.

## Environment
- Node.js: version 18.13.0 or above
- MySQL: version 8.0.33 or above
- Redis: version 7.0.11 or above

## Installation and Execution
1. Install packages
    ```
    npm install
    ```
2. Create a `.env` file and set your environment variables, you can refer to `.env.example` for setting up. Below is the list of the environment variables you need to set:
    ```
    PORT: port number
    REDIS_URL: Redis connection information
    SQL_URL: SQL connection information
    JWT_SECRET: jwt secret
    ROOT_EMAIL: admin account
    FRONTEND_URL: Frontend connection address
    ```
3. If there are front-end static files, you can name it as `frontend` and put it in the root directory.
  The frontend page can refer [here](https://github.com/YINWEIHSU/blog-app-frontend).

4. Input the following command in the terminal to run the application.
    ```
    npm run dev
    ```