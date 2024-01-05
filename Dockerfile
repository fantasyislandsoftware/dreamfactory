FROM i386/alpine as base

# Install packages
RUN apk add --update npm wine nano python3 git

# Init wine
#RUN wine regedit

# Download compilers
#WORKDIR /home/node/app
#RUN mkdir compilers
#WORKDIR /home/node/app/compilers

#RUN git clone https://github.com/boriel/zxbasic.git

# Setup node
WORKDIR /home/node/app
COPY ./backend/package.json ./
RUN npm install
