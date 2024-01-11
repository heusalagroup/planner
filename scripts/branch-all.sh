#!/bin/bash
cd "$(dirname "$0")/.."
#set -x

FORMAT='%-20s %-16s %-30s %-20s %s\n'

ROOT_BRANCH="$(
    git branch \
     | grep -E '^\*' \
     | sed -re 's/^\* *//' \
     | tr -d '\n'
)"

printf "$FORMAT" "$ROOT_BRANCH" "." "." "." "."

cat .gitmodules |grep -F path|awk '{print $3}'|while read DIR; do  
  (
    PARENT_DIR=$DIR
    cd $DIR
    MODULE=$(echo $DIR|sed -re 's@^.*/src/@@'|tr '/' '.')
    CONTEXT=$(echo $DIR|awk -F'/' '{print $1}')
    TAG=$((git describe --tags 2>/dev/null)|sort -n|tail -n1)
    PARENT_MODULE=$MODULE
    export PARENT_CONTEXT=$CONTEXT
    if test "x$TAG" = x; then
      TAG="$(git rev-parse --short HEAD)"
    fi
    BRANCH="$(
      git branch \
       | grep -E '^\*' \
       | sed -re 's/^\* *//' \
       | tr -d '\n'
    )"

    printf "$FORMAT" "$BRANCH" "$CONTEXT" "$MODULE" "$TAG" "$DIR"

    if test -f .gitmodules; then
	cat .gitmodules |grep -F path|awk '{print $3}'|while read DIR; do  
	  (
	    cd $DIR
	    MODULE=$(echo $DIR|sed -re 's@^src/@@'|tr '/' '.')
	    CONTEXT="$PARENT_CONTEXT"
	    TAG=$((git describe --tags 2>/dev/null)|sort -n|tail -n1)
	    if test "x$TAG" = x; then
	      TAG="$(git rev-parse --short HEAD)"
	    fi
	    BRANCH="$(
	      git branch \
	       | grep -E '^\*' \
	       | sed -re 's/^\* *//' \
	       | tr -d '\n'
	    )"
	
	    printf "$FORMAT" "$BRANCH" "$CONTEXT" "$MODULE" "$TAG" "$PARENT_CONTEXT/$DIR"
	
	  ); 
	done
    fi

  ); 
done
