FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

EXPOSE 5173

ENV CHOKIDAR_USEPOLLING=true
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
