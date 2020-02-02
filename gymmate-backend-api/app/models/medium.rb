class Medium < ApplicationRecord
  belongs_to :mediable, polymorphic: true
  belongs_to :account
  has_many :likes, as: :likeable
  has_attached_file :attachment
  validates_attachment :attachment, presence: true
end
