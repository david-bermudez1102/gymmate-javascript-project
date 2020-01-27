class Account < ApplicationRecord
  belongs_to :userable, polymorphic: true
  has_many :pictures
  has_many :videos
  has_many :likes
  has_secure_password
end
