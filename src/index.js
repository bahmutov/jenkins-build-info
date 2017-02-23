'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

function init (env) {
  env = env || process.env

  const isOnJenkins = Boolean(env.JENKINS_URL)

  function collectionInformation (projectName) {
    la(is.maybe.string(projectName), 'expected project name', projectName)

    const forced = Boolean(env.FORCE)
    if (forced) {
      console.log('skipping environment variable checks, because FORCE')
    } else {
      la(isOnJenkins, 'cannot get information if not running on Jenkins')
      la(is.url(env.BUILD_URL), 'invalid BUILD_URL', env)
    }

    const info = {
      // build info
      buildId: env.BUILD_ID,
      buildNumber: env.BUILD_NUMBER,
      buildTag: env.BUILD_TAG,
      buildUrl: env.BUILD_URL,
      // project info
      jobName: env.JOB_NAME || projectName,
      jobUrl: env.JOB_URL,
      // misc
      gitCommit: env.GIT_COMMIT,
      gitBranch: env.GIT_BRANCH,
      jenkinsUrl: env.JENKINS_URL
    }

    info.toString = buildToString.bind(info, info)
    return info
  }

  function buildToString (info) {
    la(is.object(info), 'expect info object', info)

    const buildInfo = `
==============================
 Build information (Jenkins)
==============================
Build ID: ${info.buildId}
Build number: ${info.buildNumber}
Build tag: ${info.buildTag}
Build URL: ${info.buildUrl}
Job name: ${info.jobName}
Job URL: ${info.jobUrl}
Git commit: ${info.gitCommit}
Git branch: ${info.gitBranch}
Jenkins URL: ${info.jenkinsUrl}
`
    return buildInfo
  }

  return {
    isOnJenkins,
    collectionInformation
  }
}

module.exports = init

