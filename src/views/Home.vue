<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="secondary" class="ion-text-center">
            <ion-title> <img height="56" src="/assets/img/logo-header-main.png" /></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-text-center">
  
        <ion-item v-if="!isLoaded" class="ion-margin">
            <ion-label position="floating">Código del cliente</ion-label>
            <ion-input v-model="form.code" type="text"></ion-input>
        </ion-item>
        
        <ion-button v-if="!isLoaded" color="primary" @click="getClient();getPols()">Ingresar</ion-button>

        <ion-segment v-if="isFetching" class="ion-margin-top">
            <ion-spinner name="crescent"></ion-spinner>
        </ion-segment>

        <ion-segment v-if="isLoaded">
            <dataclient :clientDataFromHome="form" @clearClientForm="clearForm"></dataclient>
        </ion-segment>

    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonLabel, IonInput, IonItem , IonButton , IonSegment , IonSpinner , toastController} from '@ionic/vue';
import axios from 'axios';
import DataClient from '../components/DataClient.vue'; 


export default  {
  name: 'Home',
  components: { 'dataclient' : DataClient, IonHeader, IonToolbar, IonTitle, IonContent, IonPage , IonLabel, IonInput, IonItem , IonButton , IonSegment , IonSpinner }
  ,data () {
      return {
            page : {
                submit : false,
                success : false,
                loading : false,
                error : false,
                complete : false,
                process : false,
                message : ''
            },
            form: {
                code : '',//5000963
                client : {},
                exists : false
            },
            pols : [], 
            isFetching : false,
            isLoaded : false
        }
  },
  methods:{
        clearForm () {
            this.page.complete = false
            this.page.success = false
            this.form.exists = false
            this.form.code = ''
            this.form.client = {}

            this.isFetching = false
            this.isLoaded = false
        },
        getClient () {
            this.isFetching = true
            this.page.complete = true
            this.page.process = true
            this.page.error = false
            const params = {
                'client_code' : this.form.code
            }
            //axios.get( 'https://raw.githubusercontent.com/CesarxArteaga/Simple-APIREST__TEST/master/test.json' )
            axios.get( 'http://127.0.0.1:8000/api/v1/seller/client' , { params : params } )
                .then( response => {
                    console.log( response.data )
                    this.page.message = response.data.message
                    if ( response.data.status ) {
                        this.form.exists = response.data.exists
                        this.form.client = response.data.row
                        setTimeout( () => {
                            this.page.success = true
                            this.page.process = false
                            this.isFetching = false
                            this.isLoaded = true
                        } , 500 )
                    } else {
                        this.page.complete = false
                        this.page.process = false
                        this.page.error = true
                        this.isFetching = false
                        this.showToast()
                    }
                })
                .catch( failure => {
                    console.log( failure )
                })
        },
        getPols(){
            axios.get('http://127.0.0.1:8000/api/v1/seller/poll/create' )
                .then( response => {
                    this.$store.dispatch('SET_POLS_ACTION' , response.data.rows )
                })
                .catch( failure => {
                    console.log(failure)
                })
        },
        async showToast () {
            const toast = await toastController.create({
                color: 'danger',
                duration: 2000,
                message: 'Cliente No Existe',
                showCloseButton: true
            });

            await toast.present();
        }
  }
}
</script>