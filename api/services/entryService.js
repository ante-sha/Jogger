'use strict';

const Entry = require('../models/entry')

class EntryService {
    static getEntriesByUserId(id) {
        return new Promise((resolve, reject) => {
            Entry.find({userId: id}).select('_id userId duration length week').exec().then(doc => {
                if (doc.length > 0) {
                    const response = {
                        count: doc.length,
                        entry: doc.map(a => {
                            return {
                                _id: a._id,
                                userId: a.userId,
                                duration: a.duration,
                                length: a.length,
                                week: a.week,
                                request: {
                                    type: 'GET, DELETE, PATCH',
                                    url: 'http://localhost:3000/entry/' + a._id
                                }
                            }
                        })
                    }
                    //res.status(200).json(response)
                    resolve(response)
                } else {
                    //res.status(404).json({message: 'Entries not found'})
                    reject({message: 'Entries not found'});
                }
            }).catch(error => {
                console.log(error)
                //res.status(500).json({message: error})
                reject({message: error})
            })
        })
    }
}


module.exports = EntryService;