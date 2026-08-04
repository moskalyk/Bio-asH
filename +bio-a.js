const argv = process.argv
const { exec } = require('child_process');

;(async () => {
    if(!argv[2]){
        console.log(`
   ~~   ~~   ~~   ~~
 ~    ~    ~    ~    ~
~    ~B~  ~a~  ~H~    ~
 ~    ~    ~    ~    ~
   ~~   ~~   ~~   ~~
            
        `)
        console.log('Bio-asH')
        console.log('')
        console.log('usage: node +bio-a [command]')
        console.log('')
        console.log('commands:')
        // console.log(' test-ring \t\ttest a ring signature flow')
        console.log(' test-redux \t\ttest a redux with concat and trap flow')
        console.log(' fat\t\t\trun a fat reaction series')
        console.log(' dist-fatty-acid-synthase\t\t\trun a fatty acid synthase calculation on multiple nodes')
        console.log(' dist-calorie\t\t\tTODO: run a calorie calculation on multiple nodes')
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    if(argv[2]){
        
    }
    
    switch(argv[2]){
        // case 'test-ring': {
        //     console.log('running a streamed ring stdout')
        //     // TODO: make stream output
        //     // exec('node ringish-signatures/tests/node3.js && node ringish-signatures/tests/node2.js && node ringish-signatures/tests/node1.js', (err, stdout, stderr) => {
        //     //   if (err) {
        //     //     console.error(`Error: ${err.message}`);
        //     //     return;
        //     //   }
        //     //   console.log(`Output: ${stdout}`);
        //     //   console.error(`Error Output: ${stderr}`);
        //     // });
        //     break;
        // }
        case 'test-redux': {
            require('./tests/redux.test.js')
            break;
        }
        case 'fat': {
            const callable = '^-  @' + '  ' + `.^(@  %gx  /~zod/%fat/${1}/r/site/%spec)`
            const regex = /\S{2}\((?<type>\S)\s{2}%(?<care>\S{2})\s{2}\/(?<ship>~\S{3})\/(?<desk>)+?(?<agent>%.+)\/(?<case>\d+)(?<path>\/\S+)+(?=\/%)\/(?<noun>.+)\)/;
            const scry = callable.match(regex)
            require(`./tests/${scry.groups.agent.replace('%','')}.test.js`)
            break;
        }
        
        case 'dist-fatty-acid-synthase': {
            const callable = '^-  @' + '  ' + `.^(@  %gx  /~zod/%calorie/${1}/r/site/%spec)`
            const regex = /\S{2}\((?<type>\S)\s{2}%(?<care>\S{2})\s{2}\/(?<ship>~\S{3})\/(?<desk>)+?(?<agent>%.+)\/(?<case>\d+)(?<path>\/\S+)+(?=\/%)\/(?<noun>.+)\)/;
            const scry = callable.match(regex)
            
            import(`./tests/ringish-signatures/tests/dist${capitalizeFirstLetter(scry.groups.agent.replace('%',''))}/nodes/mor.js`).then(() => {
                console.log('running after ~mor')
                require(`./tests/ringish-signatures/tests/dist${capitalizeFirstLetter(scry.groups.agent.replace('%',''))}/nodes/zod.js`)
            }).then(() => {
                console.log('post-post')
                require(`./tests/ringish-signatures/tests/dist${capitalizeFirstLetter(scry.groups.agent.replace('%',''))}/nodes/los.js`)
            })
            break
        }
    }
})()
