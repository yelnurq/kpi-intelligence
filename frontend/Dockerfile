FROM node:20-alpine

WORKDIR /app

# Копируем только файлы зависимостей
COPY package*.json ./

# Устанавливаем всё необходимое
RUN npm install --legacy-peer-deps && npm install react-is --legacy-peer-deps
RUN npx update-browserslist-db@latest

# Копируем исходники
COPY . .

# Открываем порт для React
EXPOSE 3000

# Запускаем сервер разработки (Hot Reload)
CMD ["npm", "start"]