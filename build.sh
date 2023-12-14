ROOT=$(pwd)

# get all directory
DIRS=$(ls -d */)

# build all directory
for dir in $DIRS
do
    # skip when dir name not start with tutorial
    if [[ $dir != tutorial* ]]; then
        continue
    fi
    cd $ROOT/$dir

    mkdir -p build
    cd build
    cmake -DCMAKE_BUILD_TYPE=DEBUG ..
    make -j4
    echo "build $dir"
done



