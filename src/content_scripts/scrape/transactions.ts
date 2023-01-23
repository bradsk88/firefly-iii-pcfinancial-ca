import {TransactionStore, TransactionTypeProperty} from "firefly-iii-typescript-sdk-fetch";
import {AccountRead} from "firefly-iii-typescript-sdk-fetch/dist/models/AccountRead";
import {getAccountNumber} from "./accounts";
import {parseDate} from "../../common/dates";
import {priceFromString} from "../../common/prices";

export function getButtonDestination(): Element {
    return document.querySelector(
        'transaction-credit div.cta-container div.right'
    )!;
}

/**
 * @param accounts The first page of account in your Firefly III instance
 */
export async function getCurrentPageAccount(
    accounts: AccountRead[],
): Promise<AccountRead> {
    const div = document.querySelector(
        'div#main-content div.selector-container accounts-side-nav'
    )!;
    const number = getAccountNumber(div)
    return accounts.find(a => a.attributes.accountNumber === number)!;
}

function getRowDate(el: Element): Date {
    const date = el.querySelector('td.date span:nth-child(1)');
    // TODO: Scrape exact time
    // const time = el.querySelector('td.date span:nth-child(2)');
    return parseDate(date!.textContent!);
}

function getRowAmount(r: Element): number {
    const posAmount = r.querySelector(".amount.positive");
    const negAmount = r.querySelector(".amount.negative")
    if (posAmount) {
        return priceFromString(posAmount!.textContent!);
    }
    return -priceFromString(negAmount!.textContent!);
}

function getRowDesc(r: Element): string {
    return r.querySelector(
        'td.description span.description-text',
    )!.textContent!
}

/**
 * @param pageAccount The Firefly III account for the current page
 */
export function scrapeTransactionsFromPage(
    pageAccount: AccountRead,
): TransactionStore[] {
    const rows = Array.from(document.querySelectorAll('div.table-container table tbody tr').values());
    return rows.map(r => {
        let tType = TransactionTypeProperty.Withdrawal;
        let srcId: string | undefined = pageAccount.id;
        let destId: string | undefined = undefined;

        const amount = getRowAmount(r);
        if (amount < 0) {
            tType = TransactionTypeProperty.Deposit;
            srcId = undefined;
            destId = pageAccount.id;
        }

        return {
            errorIfDuplicateHash: true,
            transactions: [{
                type: tType,
                date: getRowDate(r),
                amount: `${Math.abs(amount)}`,
                description: getRowDesc(r),
                destinationId: destId,
                sourceId: srcId
            }],
        };
    })
}