class Medium < ApplicationRecord
  belongs_to :mediable, polymorphic: true
  belongs_to :account
  has_many :likes, as: :likeable
end
