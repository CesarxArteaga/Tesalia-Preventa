<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="ion-text-center">
            <ion-title> <img height="56" src="/assets/img/logo-header-main.png" /></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-text-center">

        <div v-if="step==1">
            <div v-if="isLoaded==false">
                <h4>Buscar Cliente</h4>
                <ion-item class="ion-margin border" color="dark">
                    <ion-label position="floating">Cliente</ion-label>
                    <ion-input v-model="form.code" type="number"></ion-input>
                </ion-item>
                <br>
                <ion-button color="light" fill="outline" @click="goBack">Atras</ion-button>
                <ion-button color="primary" @click="getClient">Buscar</ion-button>

                <div v-if="isFetching" class="ion-margin-top">
                    <ion-spinner name="crescent" color="light"></ion-spinner>
                </div>
            </div>
            <div v-else>
                <dataclient :clientDataFromHome="form" @clearClientForm="clearForm" @nextStep="nextStep"></dataclient>
            </div>
        </div>

        <div v-if="step==2">
            <process @backStep="backStep" @nextStep="nextStep"></process>
        </div>

        <div v-if="step==3">
            <complete></complete>
        </div>

    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonLabel, IonInput, IonItem , IonButton , IonSpinner , toastController} from '@ionic/vue';
import axios from 'axios';
import DataClient from '../components/DataClient.vue'; 
/* import { Http } from '@capacitor-community/http'; */
import Process from '../components/Process.vue';
import Complete from '../components/Complete.vue';
import { Network } from '@capacitor/network'
export default  {
  name: 'SearchClient',
  components: { 'dataclient' : DataClient, 'process' : Process , 'complete': Complete , IonHeader, IonToolbar, IonTitle, IonContent, IonPage , IonLabel, IonInput, IonItem , IonButton , IonSpinner }
  ,data (){
      return {
            form: {
                code : '',//5000963
                client : {},
            },
            pols : [], 
            isFetching : false,
            isLoaded : false,
            step: 1
        }
  },
  methods:{
        nextStep(){
            if(this.step < 3){
                this.step++;
            }
        },
        backStep(){
            if(this.step > 1){
                this.step--;
            }
        },
        clearForm () {
            this.form.code = ''
            this.form.client = {}

            this.isFetching = false
            this.isLoaded = false
        },
        async getClient () {
            this.isFetching = true
            const params = {
                'client_code' : this.form.code
            }

            const network = await Network.getStatus();

            /* Si no esta conectado obtiene cliente del localstorage */
            if(!network.connected){
                /* Si no tiene clientes en localStorage presentar mensaje de error */
                if(!localStorage.getItem('clientes-preventa')){
                    this.isFetching = false
                    return this.showToast('Sin Conexión - Syncroniza los clientes desde el home para trabajar offline')
                }
                let clientFound = null
                const clients = JSON.parse(localStorage.getItem('clientes-preventa'));
                for (let index = 0; index < clients.length; index++) {
                    const client = clients[index];
                    if(client.code == this.form.code){
                        clientFound = client
                        break;
                    }
                }

                if(clientFound == null){
                    this.isFetching = false
                    this.showToast('No existe cliente')
                }else{
                    this.form.client = clientFound;
                    this.$store.dispatch('SET_CLIENT_ACTION', clientFound ) //Guardando cliente en store
                    setTimeout(() => {
                        this.isFetching = false
                        this.isLoaded = true
                    }, 500);
                }
                
            }else{
           
            /* const url = 'https://preventa.plantroya.com/api/v1/seller/client';
            const headers = {};

            const options = {
                url: url,
                headers : headers,
                params: params
            }

            try {
                const response = await Http.get(options);
                if ( response.data.status ) {
                        this.form.client = response.data.row
                        this.$store.dispatch('SET_CLIENT_ACTION', response.data.row) //Guardando cliente en store
                        setTimeout( () => {
                            this.isFetching = false
                            this.isLoaded = true
                        } , 500 )
                    } else {
                        this.isFetching = false
                        this.showToast(response.data.message)
                    }
            } catch (error) {
                console.log(error);
                this.showToast(error.error);
            } */

            axios.get( 'https://preventa.plantroya.com/api/v1/seller/client' , { params : params } )
                .then( response => {
                    console.log( response.data )
                    if ( response.data.status ) {
                        this.form.client = response.data.row
                        this.$store.dispatch('SET_CLIENT_ACTION', response.data.row) //Guardando cliente en store
                        setTimeout( () => {
                            this.isFetching = false
                            this.isLoaded = true
                        } , 500 )
                    } else {
                        this.isFetching = false
                        this.showToast( response.data.message )
                    }
                })
                .catch( failure => {
                    console.log( failure )
                    this.showToast(failure)
                    this.isFetching = false
                })
            }
        },
        async showToast (message) {
            const toast = await toastController.create({
                color: 'danger',
                duration: 2000,
                message: message,
                showCloseButton: true
            });

            await toast.present();
        },
        goBack(){
            this.$router.back()
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