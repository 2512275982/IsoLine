
//构造函数模式
function Person(name, age, job){
	this.name = name;
	this.age = age;
	this.job = job;
	this.friends = ["Shelby","Court"];
}

//原型模式
Person.prototype = {      
	constructor : Person,
	sayName : function(){
		alert(this.name);
	}
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1.friends.push("Van");
alert(person1.friends);   //"Shelby,Court,Van"
alert(person2.friends);   //"Shelby,Court"

alert(person1.friends === person2.friends);  //false
alert(person1.sayName === person2.friends);   //true
//原型模式使用验证，不同的实例调用
person1.sayName();   //"Nicholas"
person2.sayName();   //"Greg"
