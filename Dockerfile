FROM node:18-alpine

WORKDIR /app

# 依存だけ先に入れる
COPY package.json package-lock.json ./
# Prismaのschemaを先に用意（←ここが重要）
COPY prisma ./prisma
RUN npm ci

# アプリ本体をコピー
COPY . .

# 念のため明示的に生成（postinstallと二重でもOK）
RUN npx prisma generate

EXPOSE 3000
CMD ["npm","run","dev"]
