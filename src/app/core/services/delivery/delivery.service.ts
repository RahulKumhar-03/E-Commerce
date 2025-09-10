import { Injectable, signal } from '@angular/core';
import { DeliveryLocation } from '../../interfaces/delivery-location.interface';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  public isEditing = signal<boolean>(false);
  
  constructor() { }

  public generateId(){
    let newDeliveryId = parseInt(localStorage.getItem('lastDeliveryId') || '0', 10) + 1;
    localStorage.setItem('lastDeliveryId', newDeliveryId.toString());
    return newDeliveryId;
  }

  public getAllDeliveryLocation():DeliveryLocation[]{
    let deliveryLocations:DeliveryLocation[] = JSON.parse(localStorage.getItem('deliveryLocation') || '[]');
    return deliveryLocations;
  }

  public createDeliveryLocation(newDeliveryLocation:DeliveryLocation):boolean{
    let allDeliveryLocations = this.getAllDeliveryLocation();
    const locationExists = allDeliveryLocations.find(location => location?.city.toLowerCase() === newDeliveryLocation.city.toLowerCase() && location?.state.toLowerCase() === newDeliveryLocation.state.toLowerCase());

    if(locationExists){
      return false;
    } else {
      allDeliveryLocations.push(newDeliveryLocation);
      localStorage.setItem('deliveryLocation',JSON.stringify(allDeliveryLocations));
      return true;
    }
  }

  public updateDeliveryLocation(updatedDeliveryLocation: DeliveryLocation):boolean{
    let allDeliveryLocations = this.getAllDeliveryLocation();
    const locationExistsIndex = allDeliveryLocations.findIndex(location => location?.id === updatedDeliveryLocation.id);

    if(locationExistsIndex !== -1){
      if(allDeliveryLocations.find(location => location.city === updatedDeliveryLocation.city)){
        return false;
      }
      allDeliveryLocations[locationExistsIndex] = updatedDeliveryLocation;
      localStorage.setItem('deliveryLocation',JSON.stringify(allDeliveryLocations));
      return true;
    }
    return false;
  }

  public deleteDeliveryLocation(deliveryLocationId: number){
    let allDeliveryLocations = this.getAllDeliveryLocation();
    allDeliveryLocations = allDeliveryLocations.filter(location => location?.id !== deliveryLocationId)
    localStorage.setItem('deliveryLocation',JSON.stringify(allDeliveryLocations));
  }
}
