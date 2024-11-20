export class RideCreationRequestBuilder {
    constructor() {
      this.data = {};
    }
  
    setOrigin(lat, lng) {
      this.data.origin = `${lat},${lng}`;
      return this;
    }
  
    setDestination(lat, lng) {
      this.data.destination = `${lat},${lng}`;
      return this;
    }
  
    setAddresses(originAddress, destinationAddress) {
      this.data.originAddress = originAddress;
      this.data.destinationAddress = destinationAddress;
      return this;
    }
  
    setDateAndTime(date, time) {
      this.data.date = date;
      this.data.time = time;
      return this;
    }
  
    setDesiredPassengersNumber(passengers) {
      this.data.desiredPassengersNumber = passengers;
      return this;
    }
  
    setPrice(price) {
      this.data.price = price;
      return this;
    }
  
    setDistance(distance) {
      this.data.distance = distance;
      return this;
    }
  
    setDuration(duration) {
      this.data.duration = duration;
      return this;
    }
  
    build() {
      return this.data;
    }
  }