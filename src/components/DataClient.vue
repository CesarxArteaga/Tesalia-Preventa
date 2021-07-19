<template>

        <div class="ion-padding">
                <ion-text>
                    <h1>Verifique los datos del cliente y el código del vendedor</h1>
                </ion-text>

                <ion-list>
                    <ion-item>
                        <ion-label position="stacked">Región</ion-label>
                        <ion-input disabled v-model="clientData.client.region.name" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Agencia</ion-label>
                        <ion-input disabled v-model="clientData.client.agency.name" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Supervisor</ion-label>
                        <ion-input disabled v-model="clientData.client.supervisor.code" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Ruta</ion-label>
                        <ion-input disabled v-model="clientData.client.way.code" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Código de Cliente</ion-label>
                        <ion-input disabled v-model="clientData.client.code" ></ion-input>
                    </ion-item>
                </ion-list>

                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-button color="secondary" @click="clearForm">
                                Regresar
                            </ion-button>
                        </ion-col>
                        <ion-col>
                            <ion-button color="primary" router-link="/process">
                                Continuar
                            </ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
        </div>
        
    
</template>

<script>
import {   IonText  , IonList,  IonItem , IonLabel , IonInput  , IonGrid, IonRow , IonCol , IonButton} from '@ionic/vue';

export default  {
  name: 'DataClient',
  components: {   IonText   , IonList,  IonItem , IonLabel , IonInput , IonGrid, IonRow , IonCol , IonButton},
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
     }
  },
  mounted() {
        /* this.clientData = this.data
        console.log(this.clientData.client) */
    }
}
</script>