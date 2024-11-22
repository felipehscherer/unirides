export class RideSearchRequestBuilder {
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
  
    build() {
      return this.data;
    }
  }