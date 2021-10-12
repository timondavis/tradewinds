FROM node:14.17.6

RUN /bin/bash -c 'mkdir /usr/games/tradewinds'
WORKDIR /usr/games/tradewinds
COPY . /usr/games/tradewinds

EXPOSE 80

ENTRYPOINT ["./entrypoint.sh"]
