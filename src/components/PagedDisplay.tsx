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

export interface PageDisplayPropsAction {
    actionName : string,
    handler : () => Promise<boolean>
}

export interface PagedDisplayProps {
    displayedProperties : PageDisplayPropsTableHead [];
    pageSize : number;
    getPage : (size : number, page : number, filters : any) => Promise<any []>;
    rowActions : PageDisplayPropsRowAction [];
    actions : PageDisplayPropsAction [];
    filters? : any;
}

export class InvalidPageError extends Error { };

const PagedDisplay : React.FC <PagedDisplayProps> = (props : PagedDisplayProps) => {
    const [page, setPage] : any = useState (0);
    const [loading, setLoading] : any = useState (false);
    const [error, setError] : any = useState (null);
    const [info, setInfo] : any = useState (null);
    const [data, setData] : any = useState ([]);
    const [hasPrevPage, setHasPrevPage] : any = useState (false);
    const [hasNextPage, setHasNextPage] : any = useState (false);

    const refreshItemList = async () => {
        setLoading (true);
        setError (null);
        setInfo (null);
        try {
            const newData = await props.getPage (props.pageSize, page, props.filters);
            setData (newData);
            setLoading (false);
            setHasPrevPage (page > 0);
            setHasNextPage (newData.length >= props.pageSize);
        } catch (err) {
            setData ([]);
            if (err instanceof InvalidPageError) {
                if (page > 0) {
                    setPage (0);
                } else {
                    setInfo ('no results were found for given query');
                }
            } else {
                setError (String (err));
            }

            setLoading (false);
        }
    };

    useEffect (() => {
        refreshItemList ();
    }, [props.filters, page]);

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
        for (const action of props.rowActions) {
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

    // table wide actions
    const actions : React.ReactNode [] = [];
    for (const action of props.actions) {
        actions.push (<button onClick={() => {
            action.handler ().then (reload => {
                if (reload) {
                    refreshItemList ();
                }
            })
        }}>{action.actionName}</button>)
    }

    return (
        <div className="pageViewContainer">
            {!!error ? <div className="error">{error}</div> : <></>}
            {!!info ? <div className="info">{info}</div> : <></>}
            <div className="tableActionsContainer">
                {actions}
            </div>
            <div className="pageViewNavigation">
                <div className="prevPage">
                    <button disabled={!hasPrevPage} onClick={() => {
                        if (page > 0) {
                            setPage (page - 1);
                        }
                    }}>◀ prev page</button>
                </div>
                <div className="currentPage">
                    <p>page {page + 1}</p>
                </div>
                <div className="nextPage">
                    <button disabled={!hasNextPage} onClick={() => {
                        setPage (page + 1);
                    }}>next page ▶</button>
                </div>
            </div>
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