FROM i386/alpine as base

# Install packages
RUN apk add --update npm wine nano python3 git build-base

ARG HOME_PATH=/home/node
ARG APP_PATH=${HOME_PATH}/app
ARG COMPILERS_PATH=${APP_PATH}/compilers

# Init wine
#RUN wine regedit

# Download compilers
WORKDIR $APP_PATH
RUN mkdir compilers
WORKDIR ${COMPILERS_PATH}

# ZXBasic
RUN git clone https://github.com/boriel/zxbasic.git

# bas2tap
RUN git clone https://github.com/andybalaam/bas2tap.git
WORKDIR ${COMPILERS_PATH}/bas2tap
RUN make

ENV PATH="${COMPILERS_PATH}/zxbasic:$PATH"
ENV PATH="${COMPILERS_PATH}/bas2tap:$PATH"

# Setup node
WORKDIR /home/node/app
COPY ./backend/package.json ./
RUN npm install
