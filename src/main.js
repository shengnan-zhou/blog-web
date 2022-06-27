import Vue from 'vue';
import router from './router/index';
import App from './App.vue';

function getComponent() {
    return import("lodash")
      .then(({ default: _ }) => {
        const element = document.createElement("div");
  
        element.innerHTML = _.join(["Hello", "webpack"], " ");
  
        return element;
      })
      .catch((error) => "An error occurred while loading the component");
  }
  
  const button = document.createElement("button");
  button.innerHTML = "Click me ";
  button.onclick = () => {
    getComponent().then((component) => {
      document.body.appendChild(component);
    });
  };
  
  document.body.appendChild(button);


new Vue({
    el:'#app',
    router,
    render: (h) => h(App)
}).$mount('#app');
