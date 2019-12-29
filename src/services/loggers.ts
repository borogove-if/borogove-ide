import ReactGA from "react-ga";
import * as Sentry from "@sentry/browser";

import ProjectService from "./projects/ProjectService.class";

import settingsStore from "stores/settingsStore";

const isProduction = process.env.NODE_ENV === "production";

type TrackingType = "analytics" | "errors";

let sentryInitialized = false;
let analyticsInitialized = false;


/**
 * Check if tracking is enabled
 */
function isAllowed( type: TrackingType ): boolean {
    // don't log anything during development
    if( !isProduction ) {
        return false;
    }

    return settingsStore.getSetting( "logging", type );
}


/**
 * Initialize analytics and error tracking services
 */
export function initLoggers(): void {
    const analyticsId = process.env.REACT_APP_GA_ID;
    const sentryDsn = process.env.REACT_APP_SENTRY_DSN;

    if( analyticsId && isAllowed( "analytics" ) && !analyticsInitialized ) {
        ReactGA.initialize( analyticsId );
        analyticsInitialized = true;
    }

    if( isAllowed( "errors" ) && !sentryInitialized ) {
        Sentry.init({
            dsn: sentryDsn,

            // only send the event if the user hasn't opted out
            beforeSend: ( event ) => {
                if( isAllowed( "errors" ) ) {
                    return event;
                }

                return null;
            }
        });
        sentryInitialized = true;
    }
}


/**
 * Sends a custom logging message to Sentry.
 *
 * Returns true if user has error logging enabled (and logging probably succeeded)
 * or false if logging is disabled and no message has been sent.
 */
export function logErrorMessage( message: string ): boolean {
    if( isAllowed( "errors" ) && sentryInitialized ) {
        Sentry.captureMessage( message );
        return true;
    }

    return false;
}


/**
 * Log a page view
 */
export function pageView( page: string ): void {
    if( isAllowed( "analytics" ) && analyticsInitialized ) {
        ReactGA.pageview( page );
    }
}


/**
 * Set project tags for error reporting after starting a project
 */
export function setProjectTags( project: ProjectService ): void {
    if( isAllowed( "errors" ) ) {
        if( !sentryInitialized ) {
            initLoggers();

            if( !sentryInitialized ) {
                return;
            }
        }

        Sentry.setTag( "system_id", project.id );
        Sentry.setTag( "system_language", project.language );
    }
}