First you need to get MongoDB, Express, Angular and Nodejs

##MongoDB installation steps

  	$ sudo port install mongodb
  
  	$ sudo mkdir -p /opt/local/var/db/mongodb_data
  
  	$ sudo mkdir -p /opt/local/var/log/mongodb/
  
  	$ sudo mkdir -p /opt/local/etc/mongodb
  
  	$ sudo chown -R $USER /data/db
  
  	To start mongo server type mongod and to open the mongo shell type mongo 
  
##Nodejs installation steps 
  
  	$ port install nodejs
	
    This installs NPM(node package manager) and node itself. To run node type node in terminal
  	
##Express installation steps 
  
    $ npm install express
  		
    We use NPM to get express
		
##Angular installation steps 

    $ npm install -g bower
	
	$ bower install angular
	
	bower is also a package manager 
	
##Create application skeleton 

    $ npm install express-generator -g
	
	$ express myapp
	
	$ cd myapp
	
	$ npm install