import { useEffect, useState } from "react";
import loaingSpinner from '../resources/loading.gif';

export interface PageDisplayPropsTableHead {
    columnName : string,
    propertyName : string,
    parser? : (value : any) => string
}

export interface PageDisplayPropsRowAction {
    actionName : string,
    handler : (item : any) => Promise<boolean>
}

export interface PagedDisplayProps {
    displayedProperties : PageDisplayPropsTableHead [];
    pageSize : number;
    getPage : (size : number, page : number, filters : any) => Promise<any []>;
    actions : PageDisplayPropsRowAction [];
    filters? : any;
}

const PagedDisplay : React.FC <PagedDisplayProps> = (props : PagedDisplayProps) => {
    const [page, setPage] : any = useState (0);
    const [loading, setLoading] : any = useState (false);
    const [error, setError] : any = useState (null);
    const [data, setData] : any = useState ([]);

    const refreshItemList = async () => {
        setLoading (true);
        try {
            setData (await props.getPage (props.pageSize, page, props.filters));
            setLoading (false);
        } catch (err) {
            setError (String (err));
            setLoading (false);
        }
    };

    useEffect (() => {
        refreshItemList ();
    }, [props.filters]);

    // prepare the table header
    const headerRow : React.ReactNode [] = [];
    for (const property of props.displayedProperties) {
        headerRow.push (<td key={property.columnName}>{property.columnName}</td>)
    }
    headerRow.push (<td key="actions">actions</td>)

    // prepare table content
    const rows : React.ReactNode [] = [];
    for (const row of data) {
        const cols : React.ReactNode [] = [];
        for (const property of props.displayedProperties) {
            const raw : any = row [property.propertyName];
            const parsed : string = (property.parser) ? property.parser (raw) : String (raw);

            cols.push (<td>{parsed}</td>);
        }

        const actions : React.ReactNode [] = [];
        for (const action of props.actions) {
            actions.push (<a className="listActionLink" href="#" onClick={() => {
                action.handler (row).then (reload => {
                    if (reload) {
                        refreshItemList ();
                    }
                }).catch (err => {
                    setError (String (err));
                });
            }}>{action.actionName}</a>)
        }

        cols.push (<td>{actions}</td>);
        rows.push (<tr>{cols}</tr>);
    }

    return (
        <div className="pageViewContainer">
            {!!error ? <div className="error">{error}</div> : <></>}
            {!loading ? (
                <table className="table" cellSpacing={0} cellPadding={0}>
                    <thead>
                        <tr>
                            {headerRow}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            ) : (<div className="loadingSpinner"><img src={loaingSpinner} alt="loading..."></img></div>)}
        </div>
    )
};

export default PagedDisplay;