import * as React from "react";
import { RouteComponentProps } from "react-router";

import styles from "./index.css";
import { Link } from "react-router-dom";

import ad1 from "./ad1.jpg";
import ad2 from "./ad2.jpg";

import photo1 from "./photo1.jpg";
import photo2 from "./photo2.jpg";
import photo3 from "./photo3.jpg";
import photo4 from "./photo4.jpg";
import photo5 from "./photo5.jpg";

interface HomeSceneProps {

}

export function HomeScene(props: HomeSceneProps) {
    return <div className={styles.center}>
        <div className={styles.content}>
            <h1>Welkom op de website van de NFDH</h1>
            <p>
                De Nederlandse Fokkersvereniging het Drentse Heideschaap bestaat sinds 1985. Het hoofddoel is het bevorderen van de instandhouding en de fokkerij van het oude type Drents Heideschaap en de Schoonebeeker.
                De vereniging kenmerkt zich door een informele sfeer waarin het uitwisselen van kennis en informatie alsmede het ontmoeten van collega-fokkers centraal staan. Er zijn op dit moment ongeveer 250 leden en donateurs. Het ledenaantal stijgt nog steeds.    
            </p>
            <br />
            <br />
            <h2>Artikel over iets</h2>
            <span>31 november 2018</span>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies ac tortor eu accumsan. Ut semper velit libero, ut consectetur dui pretium non. Duis quis aliquam quam, in sodales neque. Morbi et orci ut libero gravida dignissim. Nam ut vulputate nibh. Nullam dictum velit a leo vehicula malesuada. Curabitur eleifend blandit urna sed vulputate. Nullam id malesuada mauris. Duis neque nisi, dignissim vel fringilla id, vulputate nec metus.
</p><p>
Morbi pellentesque sagittis consectetur. Sed sed vulputate elit. Pellentesque vehicula volutpat arcu, sit amet luctus eros gravida vitae. In mattis sodales interdum. Morbi dapibus consequat est, eget finibus felis blandit quis. Nam mollis nisl orci, ut dictum lorem varius mollis. Integer in felis sagittis, condimentum tellus a, ornare est. Nunc varius mattis tellus, id consequat erat scelerisque at. Nullam vulputate nec nibh id imperdiet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam ullamcorper velit urna, id egestas tellus mattis a. Vestibulum interdum est ut elit dictum feugiat.
</p><p>
Phasellus et purus convallis, scelerisque ante sed, ornare lectus. Suspendisse sed dui sapien. Quisque tempus ultrices ligula. Fusce hendrerit id nulla ut volutpat. Donec mattis ante sollicitudin luctus sagittis. Aenean ullamcorper lectus sed lacinia laoreet. Integer sollicitudin ex id mollis fringilla. Morbi vitae venenatis lacus. In fermentum et leo posuere auctor. Aliquam ut hendrerit lorem, non sagittis orci.
</p><p>
Fusce malesuada odio a quam accumsan, a tristique ligula pretium. Sed suscipit massa hendrerit laoreet sagittis. Vivamus in diam non enim mattis rutrum. Nullam pellentesque nisi eget eros ultrices hendrerit. Vestibulum pulvinar nunc id laoreet malesuada. Suspendisse ullamcorper nunc nulla, eget lacinia turpis consequat a. Vivamus mattis nunc risus, sed maximus sapien pretium et. Maecenas et placerat magna. Donec vitae porta tortor. Proin iaculis lectus tempor molestie pharetra. Etiam blandit ultricies eros, vitae convallis enim tempus eu. Pellentesque aliquet ornare risus, vitae condimentum magna fringilla quis. Ut ac ante dolor. Curabitur consectetur cursus eros, at fermentum metus tristique ac.
</p><p>
Integer vehicula molestie dapibus. Praesent maximus a lorem vitae luctus. In viverra iaculis ex, vitae facilisis velit rutrum pharetra. In iaculis lorem neque. Duis scelerisque quam et dui gravida pulvinar. Fusce lectus quam, maximus in metus ac, facilisis egestas tellus. Morbi maximus enim tellus, a viverra nunc maximus eget. Ut faucibus tortor id nisi pellentesque, ut fermentum erat congue. Sed id lacus dui. Aliquam dapibus tincidunt porttitor. Morbi finibus risus id accumsan placerat. Integer sit amet odio quis orci pharetra finibus. Nunc feugiat imperdiet nunc, a volutpat orci interdum ut. Sed euismod tellus urna, ut vestibulum lacus bibendum eget. Suspendisse et mollis nisi, eget iaculis turpis.
</p>
        </div>
        <div className={styles.sidebar}>
            <div className={styles.section}>
                <h4>Agenda</h4>
                <div className={styles.calendarItem}>
                    <div className={styles.calendarDate}>30 <span>nov</span></div>
                    <div className={styles.calendarDesc}>Najaarsbijeenkomst Leden NFDH</div>
                </div>
                <div className={styles.calendarItem}>
                    <div className={styles.calendarDate}>4 <span>mrt</span></div>
                    <div className={styles.calendarDesc}>Begin keuringsronde Noord-Nederland</div>
                </div>
                <Link className={styles.moreLink} to="/agenda">Toon volledige agenda</Link>
            </div>

            <div className={styles.section}>
                <h4>Vraag &amp; Aanbod</h4>
                <div className={styles.advertisment}>
                    <div className={styles.adImage}>
                        <img src={ad1} />
                    </div>
                    <div className={styles.adContent}>
                        <span className={styles.adTitle}>Ooien en dekrammen te koop</span>
                        <p>Te koop:

ooien
uit 2016, 2017, 2018 en 2019

Goedgekeurde dekrammen
uit 2014:
1000013-43094, Lichtvos-smodde, uitstekende staart, zeer goed beenwerk, ontwikkeling, vacht, 68 punten.
uit 2018:
1000828-82401, Zwart-effen, prachtige vacht, mooie kop en horens.</p>

                    </div>
                </div>
                <div className={styles.advertisment}>
                    <div className={styles.adImage}>
                        <img src={ad2} />
                    </div>
                    <div className={styles.adContent}>
                        <span className={styles.adTitle}>Schoonebeeker wol</span>
                        <p>
                        Netjes geschoren ruwe wol van Schoonebeeker schapen. Zonder vuil en zonder stro of takjes (schapen staan nooit op stal en lopen in grassige natuurgebieden).
                        </p>
                    </div>
                </div>
                <div className={styles.advertisment}>
                    <div className={styles.adImage}>
                        
                    </div>
                    <div className={styles.adContent}>
                        <span className={styles.adTitle}>Te koop lams- en schapenvlees</span>
                        <p>
                        Te koop lams-en schapenvlees van Drentse Heideschapen. Onze lammeren en schapen begrazen natuurgebieden van Staatsbosbeheer.
                        De dieren voor de slacht worden niet ingeënt en krijgen ook geen wormenkuur.
                        </p>
                    </div>
                </div>
                <Link className={styles.moreLink} to="/agenda">Toon alle advertenties</Link>
            </div>

            <div className={styles.section}>
                <h4>Foto's</h4>
                <div className={styles.album}>
                    <span className={styles.albumTitle}>Leden Lammerseizoen 2019</span>
                    <div className={styles.albumContent}>
                        <div className={styles.albumPhoto}><img src={photo1} /></div>
                        <div className={styles.albumPhoto}><img src={photo2} /></div>
                        <div className={styles.albumPhoto}><img src={photo3} /></div>
                        <div className={styles.albumPhoto}><img src={photo4} /></div>
                        <div className={styles.albumPhoto}><img src={photo5} /></div>
                    </div>
                </div>
                <Link className={styles.moreLink} to="/agenda">Toon alle foto albums</Link>
            </div>
        </div>
    </div>;
}