#!/bin/bash
cd "$(dirname "$0")/.."
set -x
git push
(
  cat .gitmodules|grep -F path|awk '{print $3}'|while read DIR; do
    (
      cd $DIR && git push
      if test -f .gitmodules; then
        cat .gitmodules|grep -F path|awk '{print $3}'|while read SUBDIR; do
          (cd $SUBDIR && git push)&
        done
      fi
    )&
  done
)|cat
