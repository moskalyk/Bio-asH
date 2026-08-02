# Bio-asH
```
   ~~   ~~   ~~   ~~
 ~    ~    ~    ~    ~
~    ~B~  ~a~  ~H~    ~
 ~    ~    ~    ~    ~
   ~~   ~~   ~~   ~~
```

Biology as Hoon. biology and biochemistry functioning cycles encoded into basic hoon. think ring like radiance from biology named connected components. 


# specs
1. [x] ring signature communication across boundaries (requires simplification)
2. [x] hoon compiling files (requires anotherlook)
3. [x] redux (state channel) (requires state_actions rather than calling compiler)
4. [x] scry callable library (requires live feed calling with tui)
5. [x] mold data dtype parser (requires more recursion)

## how to run

```
$ node +bio-a

Bio-asH

usage: node +bio-a [command]

commands:
 test-redux 		test a redux with concat and trap flow

$ node +bio-a <%command>
```

### 1. ring signatures
use of bas encryption to create signtatures that route between components with shared passwords, whereby the central feed is queryable to see if decryption is possible. the approach uses a make shift version of pinball-protocl.

### 2. hoon compiling files
use of `hoon-loader` to read `.hoon` files and parse to readabe with javascript

### 3. redux (state channel) (wip)
all states of the interaction are identifiable and callable. these states are then read in a feed, you can think blood cells in a blood stream. re: oxygen logic.

```js
    // mitochondrion
    const acetyl_CoA = 10
    const OAA = 5
    
    let ending;
    const pentosePhosphatePathway = 5*1.2
    
    cp.on('*', async (datum) => {
        const malate = datum.step
        const pyruvate = malate[0]
        console.log('pyruvate ', pyruvate)
        ending = pyruvate + pentosePhosphatePathway
    })
    
    // citrate shuffle
    cp.on('end', async () => {
        console.log('ended')
        await cp.compiler(hoon3, 0)([ending, 5])
    })
    
    // cytoplasm
    cp.on('after', async (datum) => {
        console.log('citrate ',datum) // 15
        await cp.compiler(hoon2, 0)(datum)
    })
    
    await cp.compiler(hoon1, 0)([acetyl_CoA, OAA])
```

#### example
```js
const cp = new CompilerProducer({wait: 200})

cp.on('*', async (datum) => {
    console.log(datum) // {step: 0} - {step: 9}
    await cp.compile(hoon3, 0)(['a','b','c'])
})


cp.on('after', (datum) => {
    console.log(datum) // 'abc' repeated, then 'ATG'
})

console.log('equals', 10 == await cp.compiler(/*trapGate.hoon*/hoon1, 0)(10)) // trap run, 10 == equals

await cp.compile(/*translation.hoon*/hoon3, 0)(['A', 'T', 'G'])
```

### 4. scry callable library (wip)
boot an instance of `bio-ash` cli (or `BioAsH`), then run in a file to pluck events happening as the computation flows:

```js
const { scry } = require('./scry.js');

(() => {
    // func call
    const oneOff = await scry.run(`^-  @  .^(@  %gx  /~zod/%fat/${1}/r/site/%spec)`)
    
    // evt producer
    oneOff.on('*', (datum) => {
        console.log(datum)
    })
})()
```

### 5. molds (+$ data type)
```js
    const cp = new CompilerProducer({wait: wait})
    const etransfersAsHoonJSON = cp.compiler(/*STATES*/hoon, 0)
    console.log('check', typeChecker(etransfersAsHoonJSON, {recipients: JSON.parse(eTransferDataFromFile)}))
```

#### def'n
- end
- exo

### roadmap
TODO
