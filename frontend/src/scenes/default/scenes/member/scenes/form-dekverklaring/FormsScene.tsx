import * as React from "react";
import { useLazyLoadQuery, graphql } from "react-relay/hooks";
import { useNavigate } from "react-router";

import { Toolbar } from "../../../../../../components/Toolbar";
import { Button, ButtonVariant } from "../../../../../../components/Button";
import { Icon } from "../../../../../../components/Icon";
import { Table, SelectionMode, Header, Row, Cell, Empty } from "../../../../../../components/Table";
import { SkeletonLine } from "../../../../../../components/Skeleton";

import { FormsSceneQuery, Studbook } from "./__generated__/FormsSceneQuery.graphql";
import styles from "./index.css";

export function FormsScene() {
	const onActivate = React.useCallback(function(v) {
		console.log("on activated", v);
	}, []);	

	const navigate = useNavigate();

	const onAddClick = React.useCallback(function() {
		navigate("toevoegen");
	}, [navigate]);

    return <>
        <h2 className={styles.title}>Dekverklaringen</h2>
        <Toolbar>
        	<Button key="add" onClick={onAddClick} variant={ButtonVariant.Primary}><Icon>add</Icon> Nieuwe dekverklaring indienen</Button>
        </Toolbar>

        <Table
           	onActivate={onActivate}

            head={<>
                <Header>Seizoen</Header>
				<Header>Stamboek</Header>
                <Header>Datum verzonden</Header>
            </>}
            body={<React.Suspense fallback={<FormListSkeleton />}>
                <FormList />
            </React.Suspense>}
            />
    </>;
}

function FormListSkeleton() {
    return <>
        <Row>
            <Cell colSpan="999">
                <SkeletonLine />
            </Cell>
        </Row>
        <Row>
            <Cell colSpan="999">
                <SkeletonLine />
            </Cell>
        </Row>
		<Row>
			<Cell colSpan="999">
				<SkeletonLine />
			</Cell>
		</Row>
    </>;
}

interface FormListProps {

}

function FormList(props: FormListProps): any {
    const data = useLazyLoadQuery<FormsSceneQuery>(graphql`
        query FormsSceneQuery {
            viewer {
				dekverklaringen(first: 15) @connection(key: "FormsScene_dekverklaringen") {
					edges {
						node {
							id
							season
							studbook
							date_sent
							date_corrected
						}
					}
				}
			}
        }
    `, { });

    return data.viewer.dekverklaringen.edges && data.viewer.dekverklaringen.edges.length > 0 ? data.viewer.dekverklaringen.edges.map(e => { 
        const date_sent = new Date(e.node.date_sent);
		
		let studbook;
		switch(e.node.studbook)	{
			case "DRENTS_HEIDESCHAAP": studbook = "Drents Heideschaap"; break;
			case "SCHOONEBEEKER": studbook = "Schoonebeeker"; break;
		}

		return <Row key={e.node.id}>
            <Cell>{e.node.season}</Cell>
			<Cell>{studbook}</Cell>
            <Cell><IntlDate value={date_sent} /></Cell>
        </Row>    
    }) : <Empty />;
}

const formatter = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeStyle: 'medium' });

interface IntlDateProps {
	value: Date
}

function IntlDate(props: IntlDateProps) {
	const delta = Math.round((+new Date - +props.value) / 1000);

	const minute = 60,
    	hour = minute * 60,
    	day = hour * 24;

	const formattedDate = formatter.format(props.value);

	let result;
	if (delta < 2 * minute) {
		result = 'een minuut geleden'
	} else if (delta < hour) {
		result = Math.floor(delta / minute) + ' minuten geleden';
	} else if (Math.floor(delta / hour) == 1) {
		result = '1 uur geleden'
	} else if (delta < day) {
		result = Math.floor(delta / hour) + ' uur geleden';
	} else if (delta < day * 2) {
		result = 'gisteren';
	}
	else {
		result = formattedDate;
	}
	return <span title={formattedDate}>{result}</span>;
}
