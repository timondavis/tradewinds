#!/bin/sh

if [ ! -d node_modules ] || [ -n "$FORCE_YARN_INSTALL" ]
  then yarn install --pure-lockfile
fi

# Special Installs
case $ENV_PHASE in

  stage)
    if [ -n "$USE_NODEMON" ]
      then
        yarn add nodemon --save
        ./node_modules/nodemon/bin/nodemon.js ./bin/www
    else
        npm start
    fi
  ;;

  *)
    npm start
  ;;
esac

exec "$@"
