<template>
        <h3>Complete los siguientes campos</h3>

        <ion-grid>
            <ion-row>
                <ion-col><ion-label color="medium">Producto</ion-label></ion-col>
                <ion-col><ion-label color="medium">Total</ion-label></ion-col>
            </ion-row>
            <ion-row v-for="(product , index) in products" :key="index">
                <ion-col ><ion-text><h6 class="ion-text-left">{{product.name}}</h6></ion-text></ion-col>
                <ion-col ><ion-input v-model="poll_val[index]" type="number" inputmode="numeric" style="background-color:#EEEEEE;border-radius:.5rem;width:60%;margin: 0 auto"></ion-input></ion-col>
            </ion-row>

        </ion-grid>
       

        <ion-button @click="backStep">Atras</ion-button>
        <ion-button @click="nextStep">Continuar</ion-button>
</template>

<script>
/* eslint-disable */
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonLabel, IonList , IonItem , IonButton , IonSegment , IonBackButton , IonButtons , IonGrid, IonRow, IonCol,  IonIcon , toastController , IonText} from '@ionic/vue';
import { addIcons } from "ionicons";
import { image , close } from "ionicons/icons";

export default  {
  name: 'Step2',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent ,IonLabel, IonList , IonItem , IonButton , IonSegment  , IonBackButton , IonButtons , IonIcon , IonGrid, IonRow, IonCol , IonText},
  data () {
      return {
            //products : [ 'Pepsi 355 ml', 'Pepsi 1 L' , 'Big 300 ml Negra' , 'Big 911 ml Negra' , 'Gatoreade 500 ml' , 'Sporade 475 ml' , '220V 330 ml' , 'Volt 400 ml' , 'Vive 100' ],
            products: this.$store.getters.GET_POLS,
            poll_val : [1,2,3,4,5,6,7,8,9]
        }
  },
  methods:{
        backStep(){
            this.$emit('backStep')
        },
        nextStep(){
            this.$emit('nextStep')
        },
        async showToast () {
            const toast = await toastController.create({
                color: 'warning',
                duration: 2000,
                message: 'Selecciona una imagen',
                showCloseButton: true
            });

            await toast.present();
        }
  }
  ,created () {
      addIcons({
          'image' : image,
          'close': close
      })
  }
}
</script>

<style scoped>
    
</style>