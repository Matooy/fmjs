var tgl = false;
var box = document.getElementById('codesnap-event.create');
var btn_a = document.getElementById('button-create-event-A');
var btn_d = document.getElementById('button-create-event-B');

btn_a.innerText = 'Button';
btn_d.innerText = 'Detach';

var human = {
  name: 'John Doe'
}


FM.event.bind(human, 'fooo', FM.fn.proxy(function(){
  if(!this.age){
    this.age = 1;
  }
  this.age++;
  console.log(this.name + ' -> Age: ' + this.age);
}, human));


FM.event.bind(btn_a, 'click.alert', function(){
  FM.event.trigger(human, 'fooo');
});
