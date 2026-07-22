# Bio-asH
Biology as Hoon. biology and biochemistry functioning cycles encoded into basic hoon. think ring like radiance from biology named connected components. 

# specs
1. [x] ring signature communication across boundaries
2. [x] hoon compiling files
3. [ ] redux (state channel)
4. [ ] scry callable library

## how to run

```
$ node +bio-a <%command>
```

### 1. ring signatures
use of bas encryption to create signtatures that route between components with shared passwords, whereby the central feed is queryable to see if decryption is possible. the approach uses a make shift version of pinball-protocl.

### 2. hoon compiling files
use of `hoon-loader` to read `.hoon` files and parse to readabe with javascript

### 3. redux (state channel)
all states of the interaction are identifiable and callable. these states are then read in a feed, you can think blood cells in a blood stream. re: oxygen logic.

### 4. scry callable library
boot an instance of `bio-ash` cli (or `BioAsH`), then run in a file to pluck events happening as the computation flows:

```js
const { scry } = require('./scry.js');

(() => {
    // func call
    const oneOff = await scry.run('/')
    
    // evt emitter
    scry.on('/', () => {
    
    })
})()
```

#### def'n
- end
- exo

### roadmap
TODO
