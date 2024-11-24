import React from 'react';

// Observer.js
class Observer {
    constructor() {
      if (Observer.instance) {
        return Observer.instance;
      }
      Observer.instance = this;
      this.subscribers = new Map();
      this.events = new Map();
    }
  
    // Registra um novo subscriber
    subscribe(eventName, callback, componentId) {
      if (!this.subscribers.has(eventName)) {
        this.subscribers.set(eventName, new Map());
      }
  
      const eventSubscribers = this.subscribers.get(eventName);
      eventSubscribers.set(componentId, callback);
  
      // Executa o callback com o último valor conhecido do evento, se existir
      if (this.events.has(eventName)) {
        callback(this.events.get(eventName));
      }
  
      // Retorna função de cleanup
      return () => {
        const eventSubscribers = this.subscribers.get(eventName);
        if (eventSubscribers) {
          eventSubscribers.delete(componentId);
          if (eventSubscribers.size === 0) {
            this.subscribers.delete(eventName);
          }
        }
      };
    }
  
    // Emite um evento para todos os subscribers
    notify(eventName, data) {
      this.events.set(eventName, data);
      if (this.subscribers.has(eventName)) {
        const eventSubscribers = this.subscribers.get(eventName);
        eventSubscribers.forEach(callback => callback(data));
      }
    }
  
    // Remove um subscriber específico
    unsubscribe(eventName, componentId) {
      if (this.subscribers.has(eventName)) {
        const eventSubscribers = this.subscribers.get(eventName);
        eventSubscribers.delete(componentId);
        if (eventSubscribers.size === 0) {
          this.subscribers.delete(eventName);
        }
      }
    }
  
    // Remove todos os subscribers de um evento
    clearEvent(eventName) {
      this.subscribers.delete(eventName);
      this.events.delete(eventName);
    }
  
    // Remove todos os subscribers
    clearAll() {
      this.subscribers.clear();
      this.events.clear();
    }
  
    // Obtém o último valor de um evento
    getLastValue(eventName) {
      return this.events.get(eventName);
    }
  }
  
  // Cria uma única instância do Observer
  const observer = new Observer();
  export default observer;
  
  // WithObserver.js - HOC para componentes de classe
  export const withObserver = (WrappedComponent) => {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.componentId = Math.random().toString(36).substr(2, 9);
        this.cleanupFunctions = new Map();
      }
  
      subscribe = (eventName, callback) => {
        const cleanup = observer.subscribe(eventName, callback, this.componentId);
        this.cleanupFunctions.set(eventName, cleanup);
      }
  
      unsubscribe = (eventName) => {
        if (this.cleanupFunctions.has(eventName)) {
          const cleanup = this.cleanupFunctions.get(eventName);
          cleanup();
          this.cleanupFunctions.delete(eventName);
        }
      }
  
      componentWillUnmount() {
        this.cleanupFunctions.forEach(cleanup => cleanup());
      }
  
      render() {
        return (
          <WrappedComponent
            {...this.props}
            subscribe={this.subscribe}
            unsubscribe={this.unsubscribe}
            notify={observer.notify.bind(observer)}
            getLastValue={observer.getLastValue.bind(observer)}
          />
        );
      }
    };
  };