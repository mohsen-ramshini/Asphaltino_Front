# مرحله اول: نصب dependencies
FROM node:20-bullseye AS deps
WORKDIR /app

# کپی فایل‌های package و نصب پکیج‌ها با --legacy-peer-deps
COPY package.json package-lock.json* ./
RUN npm install --production --legacy-peer-deps

# مرحله دوم: ساخت برنامه
FROM node:20-bullseye AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# مرحله سوم: آماده‌سازی برای production
FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# فقط فایل‌ها و دایرکتوری‌هایی که واقعاً وجود دارند
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# expose پورت
EXPOSE 3000

# دستور اجرا
CMD ["npm", "start"]
