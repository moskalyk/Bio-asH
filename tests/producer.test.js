class EventProducer {
    cbs = {}
    
    on(listener, cb){
        this.cbs[listener] = cb
    }
    
    produce(listener, datum){
        this.cbs[listener](datum)
    }
}


(() => {
    const eproduce = new EventProducer()
    
    eproduce.on('after', (datum) => {
        console.log(datum)
    })
    
    eproduce.produce('after', {test: 'world'})
})()
