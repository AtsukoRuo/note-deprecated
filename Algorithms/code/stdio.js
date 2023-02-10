
process.stdin.setEncoding('utf8');

async function readlineSync() {
    const readline = require('readline').createInterface({
        input : process.stdin,
        output : process.stdout
    });

    return new Promise( (resolve, reject) => {
        readline.question('', data => {
            readline.close();
            resolve(data);
        })
    });
}

async function main()
{
    let name = await readlineSync();
    console.log(name);
}

main();