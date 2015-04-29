var boy = {
  name: 'Wonderful Boy',
  age: '16'
}

function introduce_self(){
  return 'My name is ' + this.name;
}

FM.ob.absorb(boy, [introduce_self]);

result = boy.introduce_self();
