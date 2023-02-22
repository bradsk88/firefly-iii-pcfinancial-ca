import {OpeningBalance} from "../../background/firefly_export";

export function getButtonDestination(): Element {
    return document.querySelector('div.notification-container')!;
}

export function isPageReadyForScraping(): boolean {
    return true;
}

export function getAccountElements(): Element[] {
    return Array.from(
        document.querySelectorAll('credit-card account-summary')
            .values(),
    );
}

export function shouldSkipScrape(accountElement: Element): boolean {
    return false;
}

export function getAccountNumber(
    accountElement: Element,
): string {
    const nameDiv = accountElement.querySelector(
        'div.credit-account div.summary-col div.summary-labels',
    );
    return nameDiv!.textContent!.split('••••')[1].trim();
}

export function getAccountName(
    accountElement: Element,
): string {
    const number = getAccountNumber(accountElement);
    return `PC Mastercard: ${number}`;
}

export function getOpeningBalance(
    accountElement: Element,
): OpeningBalance | undefined {
    return undefined;
}