# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151223221921) do

  create_table "bookings", force: :cascade do |t|
    t.integer  "user_id",          limit: 4
    t.string   "status",           limit: 255
    t.datetime "rental_date"
    t.string   "rental_size",      limit: 255
    t.integer  "num_guests",       limit: 4
    t.string   "event_type",       limit: 255
    t.string   "event_type_other", limit: 255
    t.integer  "place_id",         limit: 4
    t.string   "place_other",      limit: 255
    t.text     "comments",         limit: 65535
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   limit: 4,     default: 0, null: false
    t.integer  "attempts",   limit: 4,     default: 0, null: false
    t.text     "handler",    limit: 65535,             null: false
    t.text     "last_error", limit: 65535
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by",  limit: 255
    t.string   "queue",      limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "faqs", force: :cascade do |t|
    t.string  "question", limit: 255
    t.string  "answer",   limit: 255
    t.boolean "approved",             default: false
    t.integer "score",    limit: 4,   default: 0
  end

  create_table "places", force: :cascade do |t|
    t.string  "place_id", limit: 255
    t.string  "name",     limit: 255
    t.float   "lat",      limit: 24
    t.float   "lon",      limit: 24
    t.string  "address",  limit: 255
    t.string  "url",      limit: 255
    t.boolean "pending",              default: true
  end

  create_table "users", force: :cascade do |t|
    t.string   "first_name",      limit: 255
    t.string   "last_name",       limit: 255
    t.string   "email",           limit: 255
    t.string   "password_digest", limit: 255
    t.boolean  "valid_email",                 default: false
    t.boolean  "is_staff",                    default: false
    t.datetime "last_login"
    t.string   "phone_number",    limit: 255
  end

end
