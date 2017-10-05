#! /usr/bin/env bash

set -e

if [ -z $1 ]; then
  echo "Usage: $0 IMAGE"
  echo
  echo "Builds the app's docker image, tagged as both \"latest\" and as the git revision of HEAD"
  exit 2
fi

set -u

(
  if [[ ! -d .git ]]; then
    echo "Working directory must be a git repository. No git repository found in: $(pwd)"
    exit 1
  fi

  if [[ -z $(git status 2> /dev/null | egrep 'working (directory|tree) clean') ]]; then
    echo "Cannot build: you have unstashed changes."
    echo "Please stash or commit them, then try again."
    exit 1
  fi

  HEAD=$(git rev-list HEAD -n1)
  docker build --build-arg version=$HEAD -t $1:$HEAD -t $1:latest .

  echo
  echo "Image tagged as:"
  echo "- $1:latest"
  echo "- $1:$HEAD"
)
