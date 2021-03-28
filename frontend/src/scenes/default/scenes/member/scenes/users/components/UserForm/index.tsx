import * as React from "react";
import { useFormValue } from "formulizer";
import classnames from "classnames";

import { TextInput } from "../../../../../../../../components/TextInput";
import { Checkbox } from "../../../../../../../../components/Checkbox";
import { Section, Row } from "../../../../../././../../../components/Form";
import { SkeletonLine, SkeletonTextInput } from "../../../../../../../../components/Skeleton";

import styles from "./index.css";

export interface UserFormProps {
    addNew: boolean
}

export interface UserFormValues {
    email: string
	name: string

	studbook_heideschaap: boolean,
	studbook_heideschaap_ko: boolean,

	studbook_schoonebeeker: boolean,
	studbook_schoonebeeker_ko: boolean,

	role_website_contributor: boolean,
	role_studbook_administrator: boolean,
	role_studbook_inspector: boolean
}

export function UserForm(props: UserFormProps) {
    return <>
        <Section title="Inloggegevens">
            <Row label="E-mail" htmlFor="tiem">
                <TextInput type="email" name="email" id="tiem" placeholder="naam@domein.nl" />
            </Row>
            {props.addNew ?
                <Row label="Wachtwoord">
                    <i>Wordt automatisch aangemaakt en verstuurd naar het bovenstaande e-mail adres</i>
                </Row>
            : null
            }
        </Section>
        <Section title="Persoonsgegevens">
            <Row label="Naam" htmlFor="tina">
                <TextInput type="text" id="tina" name="name" />
            </Row>
        </Section>
        <Section title="Stamboeken">
            <Row fullWidth={true}>
                <Checkbox label="Stamboek Drents Heideschaap" name="studbook_heideschaap" />
            </Row>
            <KoSelection name="studbook_heideschaap" />
            <Row fullWidth={true}>
                <Checkbox label="Stamboek Schoonebeeker" name="studbook_schoonebeeker" />
            </Row>
            <KoSelection name="studbook_schoonebeeker" />
        </Section>
        <Section title="Rechten">
            <Row fullWidth={true}>
                <Checkbox label="Website beheerder" name="role_website_contributor" />
            </Row>
            <Row fullWidth={true}>
                <Checkbox label="Stamboek administratie" name="role_studbook_administrator" />
            </Row>
            <Row fullWidth={true}>
                <Checkbox label="Keuringsmeester" name="role_studbook_inspector" />
            </Row>
        </Section>
    </>;
}

export interface UserFormSkeletonProps {
    addNew: boolean
}

export function UserFormSkeleton(props: UserFormSkeletonProps) {
    return <>
        <Section title="Inloggegevens">
            <Row label="E-mail" htmlFor="tiem">
                <SkeletonTextInput />
            </Row>
            {props.addNew ?
                <Row label="Wachtwoord">
                    <SkeletonTextInput />
                </Row>
            : null
            }
        </Section>
        <Section title="Persoonsgegevens">
            <Row label="Naam" htmlFor="tina">
                <SkeletonTextInput />
            </Row>
        </Section>
        <Section title="Stamboeken">
            <Row fullWidth={true}>
                <SkeletonLine />
            </Row>
            <Row fullWidth={true}>
                <SkeletonLine />
            </Row>
            <Row fullWidth={true}>
                <SkeletonLine />
            </Row>
            <Row fullWidth={true}>
                <SkeletonLine />
            </Row>
        </Section>
        <Section title="Rechten">
            <Row fullWidth={true}>
                <SkeletonLine />
            </Row>
            <Row fullWidth={true}>
                <SkeletonLine />
            </Row>
            <Row fullWidth={true}>
                <SkeletonLine />
            </Row>
        </Section>
    </>;
}

interface KoSelectionProps {
	name: string
}

function KoSelection(props: KoSelectionProps) {
	const [isChecked, _] = useFormValue<boolean>(props.name);

	if(!isChecked) {
		return null;
	}

	return <Row fullWidth={true} className={styles.koSelection}>
		<Checkbox label="Kudde overeenkomst" name={props.name + "_ko"} />
	</Row>;
}