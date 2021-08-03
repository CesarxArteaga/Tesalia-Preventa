<template>
        <div class="ion-padding">
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-item color="dark" class="border">
                                <ion-label position="stacked">Código de Cliente</ion-label>
                                <ion-input v-model="clientData.client.code" readonly="true"></ion-input>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <ion-item color="dark" class="border ion-margin-top">
                                <ion-label position="stacked">Región</ion-label>
                                <ion-input readonly="true" v-model="clientData.client.region.name"></ion-input>
                            </ion-item>
                        </ion-col>
                        <ion-col>
                            <ion-item color="dark" class="border ion-margin-top">
                                <ion-label position="stacked">Agencia</ion-label>
                                <ion-input readonly="true" v-model="clientData.client.agency.name" ></ion-input>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <ion-item color="dark" class="border ion-margin-top">
                                <ion-label position="stacked">Supervisor</ion-label>
                                <ion-input readonly="true" v-model="clientData.client.supervisor.code" ></ion-input>
                            </ion-item>
                        </ion-col>
                        <ion-col>
                            <ion-item color="dark" class="border ion-margin-top">
                                <ion-label position="stacked">Ruta</ion-label>
                                <ion-input readonly="true" v-model="clientData.client.way.code" ></ion-input>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <br>
                <ion-button fill="outline" color="light" @click="clearForm">
                    Cancelar
                </ion-button>
                <ion-button color="primary" @click="nextStep">
                    Iniciar Visita
                </ion-button>
        </div>
        
    
</template>

<script>

import { IonLabel , IonInput  , IonGrid, IonRow , IonCol , IonButton  } from '@ionic/vue';

export default  {
  name: 'DataClient',
  components: { IonLabel , IonInput , IonGrid, IonRow , IonCol , IonButton  },
  props: [
        'clientDataFromHome'
    ],
  data () {
      return {
            clientData : this.clientDataFromHome
        }
  },
  methods:{
     clearForm(){
        this.$emit('clearClientForm', true)
        this.clientData = {}
        this.$store.dispatch('SET_CLIENT_ACTION',{});
     }
     ,
     nextStep(){
        this.$emit('nextStep', true)
     }
  }
}
</script>
<style scoped>
    .border{
        border: 1px solid #FFF;
        border-radius: .25rem;
    }
</style>