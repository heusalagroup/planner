#!/bin/bash
cd "$(dirname "$0")/.."
set -x
git pull
(
  cat .gitmodules|grep -F path|awk '{print $3}'|while read DIR; do
    (
      cd $DIR && git pull
      if test -f .gitmodules; then
        cat .gitmodules|grep -F path|awk '{print $3}'|while read SUBDIR; do
          (cd $SUBDIR && git pull)&
        done
      fi
    )&
  done
)|cat
