#Angular Seed Pack

##Using the Pack
To use the Pack, we created 2 menu options, which you can find on the right of the menu. These menus can be configured in the `.codio` file.

1. **Start Server** : When you come into your Project, start the internal server (`npm start`).
1. **Preview** : this previews your app.

##Accessing the application
To access your application from a browser, you can use the menu option described above. The url of your box can be found in the `Project->Box Info` menu and will look something like this

```
https://vital-ego.box.codio.io:9500/
```

We use https so it can run inside Codio. For information about https & port access, please [refer to the documentation](/docs/boxes/access/ext-access/).


##How the Pack was prepared
This Starter Pack was built on the `Angular` Codio Certified Stack, which includes Node+Grunt+MongoDB. From the Codio Dashboard, we created a new project by importing from the Angular Seed project : `https://github.com/angular/angular-seed.git` (https://github.com/angular/angular-seed).

Once the project was opened in the IDE, we opened up a Terminal window and ran

```
npm install
```

We then modified the `package.json` file to ensure that `npm start` runs on ip address `0.0.0.0` and port 3000 by replacing the `start` key/value with this

```json
"start": "http-server -a 0.0.0.0 -p 9500 -c-1",
```


##Useful Links

- [Angular](https://angularjs.org/)
- [Node](http://nodejs.org/)
- [npm](https://www.npmjs.org/)
- [Grunt](http://gruntjs.com/)


