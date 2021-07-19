<template>

  <ion-page>
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start">
          <ion-back-button auto-hide="false" default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Ingreso de datos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-text-center ion-padding">

        <div v-show="step==1">
            <step1 @nextStep="nextStep"></step1>
        </div>
        <div v-show="step==2">
            <step2  @backStep="backStep" @nextStep="nextStep"></step2>
        </div>

    </ion-content>
  </ion-page>
</template>

<script>

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent  , IonBackButton , IonButtons  } from '@ionic/vue';
import Step1 from "@/components/Step1.vue"
import Step2 from "@/components/Step2.vue"

export default  {
  name: 'Process',
  components: { 'step1': Step1 , 'step2': Step2 , IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonBackButton , IonButtons }
  ,data () {
      return {
            step : 1
        }
  },
  methods:{
        nextStep(){
           if(this.step<3){
                this.step++;     
           }
        },
        backStep(){
            if(this.step > 1){
                this.step--;
            }
        }
  }
}
</script>

<style scoped>
</style>