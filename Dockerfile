# 1. Rasmni tanlash
FROM node:20

# 2. Ishchi katalog
WORKDIR /app

# 3. Fayllarni ko‘chirish
COPY package*.json .env ./

# 4. Bog‘liqliklarni o‘rnatish
RUN npm install

# 5. Kodni ko‘chirish
COPY . .

# 6. Port ochish (Express default 3000)
EXPOSE 3000

# 7. Loyihani ishga tushirish
CMD ["node", "index.js"]
