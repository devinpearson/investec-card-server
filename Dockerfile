# Base image of the docker container
FROM node:20-alpine
# Copy the contents of the repo into the /app folder inside the container
COPY . /app
# Update the current working directory to the /app folder
WORKDIR /app
# ENV variables
ENV FORCE_COLOR=1
# Add your CLI's installation steps here
RUN npm install && npm link
# ENTRYPOINT ["nodemon", "/usr/local/dist/index.js"]  
CMD ["npm", "run", "dev"]

# Exposing server port
EXPOSE 3010