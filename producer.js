class EventProducer {
    cb
    on(listener, cb){
        this.cb = cb
    }
    
    produce(listener, datum){
        this.cb(datum)
    }
};


(() => {
    const eproduce = new EventProducer()
    
    eproduce.on('after', (datum) => {
        console.log(datum)
    })
    
    eproduce.produce('after', {test: 'world'})
})()
