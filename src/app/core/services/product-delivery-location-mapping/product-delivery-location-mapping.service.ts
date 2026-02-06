import { Injectable, signal } from '@angular/core';
import { ProductDeliveryLocationMapTable } from '../../interfaces/product-delivery-location-mapping-table.interface';
@Injectable({
  providedIn: 'root'
})
export class ProductDeliveryLocationMappingService {
  public isEditing = signal<boolean>(false);

  constructor() { }

  public generateId(){
    let newMappingId = parseInt(localStorage.getItem('lastMappingId') || '0', 10) + 1;
    localStorage.setItem('lastMappingId', newMappingId.toString());
    return newMappingId;
  }

  public getAllMappings():ProductDeliveryLocationMapTable[]{
    let allMappings: ProductDeliveryLocationMapTable[] = JSON.parse(localStorage.getItem('allMappingsProdToDeliLoc') || '[]');
    return allMappings;
  }

  public createMapping(newMappingData: ProductDeliveryLocationMapTable):boolean{
    let allMappings = this.getAllMappings();
    const mappingExists = allMappings.find(mapping => mapping?.productId === newMappingData.productId && mapping?.deliveryLocationId === newMappingData.deliveryLocationId);

    if(mappingExists){
      return false;
    } else {
      allMappings.push(newMappingData);
      localStorage.setItem('allMappingsProdToDeliLoc', JSON.stringify(allMappings));
      return true;
    }
  }

  public updateMapping(updatedMappingData: ProductDeliveryLocationMapTable):boolean{
    let allMappings = this.getAllMappings();
    const mappingExistsIndex = allMappings.findIndex(mapping => mapping?.id === updatedMappingData.id);

    if(mappingExistsIndex !== -1 && allMappings[mappingExistsIndex].deliveryLocationId !== updatedMappingData.deliveryLocationId){
      allMappings[mappingExistsIndex] = updatedMappingData;
      localStorage.setItem('allMappingsProdToDeliLoc', JSON.stringify(allMappings));
      return true;
    } else {
      return false;
    }
  }

  public deleteMapping(mappingId: number){
    let allMappings = this.getAllMappings();
    allMappings = allMappings.filter(mapping => mapping?.id !== mappingId);
    localStorage.setItem('allMappingsProdToDeliLoc', JSON.stringify(allMappings)); 
  }
}
